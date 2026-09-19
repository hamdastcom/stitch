package ir.lontra.hamdast

import android.Manifest
import android.content.ContentValues
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import androidx.annotation.RequiresApi
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * Downloads a remote file on a background thread and saves it to the public
 * Downloads folder (like a browser download), not the photo gallery.
 */
@CapacitorPlugin(
    name = "MediaDownload",
    permissions = [
        Permission(
            strings = [Manifest.permission.WRITE_EXTERNAL_STORAGE],
            alias = "storage"
        )
    ]
)
class MediaDownloadPlugin : Plugin() {

    private companion object {
        const val TAG = "MediaDownload"
        const val CONNECT_TIMEOUT_MS = 30_000
        const val READ_TIMEOUT_MS = 5 * 60_000
        const val MAX_REDIRECTS = 5
    }

    private val executor = Executors.newSingleThreadExecutor()

    @PluginMethod
    fun save(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q &&
            getPermissionState("storage") != PermissionState.GRANTED
        ) {
            requestPermissionForAlias("storage", call, "onStoragePermission")
            return
        }
        startDownload(call)
    }

    @PermissionCallback
    private fun onStoragePermission(call: PluginCall) {
        if (getPermissionState("storage") == PermissionState.GRANTED) {
            startDownload(call)
        } else {
            call.reject("برای ذخیره فایل اجازه دسترسی به حافظه لازم است", "PERMISSION_DENIED")
        }
    }

    private fun startDownload(call: PluginCall) {
        val url = call.getString("url")
        if (url.isNullOrBlank()) {
            call.reject("آدرس فایل نامعتبر است", "INVALID_ARGUMENT")
            return
        }
        val filename = call.getString("filename")

        executor.execute {
            try {
                val savedUri = downloadAndSave(url, filename)
                call.resolve(JSObject().put("uri", savedUri))
            } catch (e: Exception) {
                Log.e(TAG, "save failed", e)
                call.reject(e.message ?: "دانلود انجام نشد", "DOWNLOAD_FAILED")
            }
        }
    }

    private fun downloadAndSave(fileUrl: String, filename: String?): String {
        val connection = openConnection(fileUrl)
        try {
            val headerMime = connection.contentType
                ?.substringBefore(";")
                ?.trim()
                ?.takeIf { it.isNotEmpty() && it != "application/octet-stream" && it != "binary/octet-stream" }
            val mimeType = headerMime ?: guessMime(fileUrl, filename)

            val displayName = buildDisplayName(filename, fileUrl, mimeType)

            connection.inputStream.use { input ->
                return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    saveWithMediaStore(input, displayName, mimeType)
                } else {
                    saveToPublicFile(input, displayName, mimeType)
                }
            }
        } finally {
            connection.disconnect()
        }
    }

    private fun openConnection(fileUrl: String): HttpURLConnection {
        var currentUrl = fileUrl
        repeat(MAX_REDIRECTS) {
            val connection = (URL(currentUrl).openConnection() as HttpURLConnection).apply {
                instanceFollowRedirects = false
                connectTimeout = CONNECT_TIMEOUT_MS
                readTimeout = READ_TIMEOUT_MS
                setRequestProperty("User-Agent", "Hamdast/Android")
                connect()
            }
            val code = connection.responseCode
            if (code in 300..399) {
                val next = connection.getHeaderField("Location")
                connection.disconnect()
                if (next.isNullOrBlank()) {
                    throw IllegalStateException("دانلود انجام نشد")
                }
                currentUrl = URL(URL(currentUrl), next).toString()
                return@repeat
            }
            if (code !in 200..299) {
                connection.disconnect()
                throw IllegalStateException("دانلود انجام نشد")
            }
            return connection
        }
        throw IllegalStateException("دانلود انجام نشد")
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun saveWithMediaStore(
        input: java.io.InputStream,
        displayName: String,
        mimeType: String
    ): String {
        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, displayName)
            put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
            put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
            put(MediaStore.MediaColumns.IS_PENDING, 1)
        }

        val resolver = context.contentResolver
        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            ?: throw IllegalStateException("ذخیره فایل انجام نشد")

        try {
            resolver.openOutputStream(uri)?.use { output ->
                input.copyTo(output)
            } ?: throw IllegalStateException("ذخیره فایل انجام نشد")

            values.clear()
            values.put(MediaStore.MediaColumns.IS_PENDING, 0)
            resolver.update(uri, values, null, null)
            return uri.toString()
        } catch (e: Exception) {
            resolver.delete(uri, null, null)
            throw e
        }
    }

    private fun saveToPublicFile(
        input: java.io.InputStream,
        displayName: String,
        mimeType: String
    ): String {
        val downloads = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
        if (!downloads.exists() && !downloads.mkdirs()) {
            throw IllegalStateException("ذخیره فایل انجام نشد")
        }
        val file = uniqueFile(downloads, displayName)
        FileOutputStream(file).use { output ->
            input.copyTo(output)
        }
        MediaScannerConnection.scanFile(
            context,
            arrayOf(file.absolutePath),
            arrayOf(mimeType),
            null
        )
        return Uri.fromFile(file).toString()
    }

    private fun uniqueFile(dir: File, displayName: String): File {
        val candidate = File(dir, displayName)
        if (!candidate.exists()) return candidate
        val dot = displayName.lastIndexOf('.')
        val stem = if (dot > 0) displayName.substring(0, dot) else displayName
        val ext = if (dot > 0) displayName.substring(dot) else ""
        var i = 1
        while (true) {
            val next = File(dir, "$stem-$i$ext")
            if (!next.exists()) return next
            i++
        }
    }

    private fun buildDisplayName(filename: String?, fileUrl: String, mimeType: String): String {
        val ext = extensionFor(mimeType, fileUrl)
        val raw = filename?.trim()?.replace(Regex("[/\\\\]"), "_").orEmpty()
        val stem = raw
            .removeSuffix(".$ext")
            .ifBlank { "hamdast-${System.currentTimeMillis()}" }
        return if (stem.contains('.')) stem else "$stem.$ext"
    }

    private fun extensionFor(mimeType: String, fileUrl: String): String {
        val fromMime = when (mimeType.lowercase()) {
            "image/png" -> "png"
            "image/jpeg", "image/jpg" -> "jpg"
            "image/webp" -> "webp"
            "image/gif" -> "gif"
            "video/mp4" -> "mp4"
            "video/webm" -> "webm"
            "video/quicktime" -> "mov"
            else -> null
        }
        return fromMime ?: extensionFromUrl(fileUrl) ?: "bin"
    }

    private fun guessMime(fileUrl: String, filename: String?): String {
        val ext = extensionFromUrl(fileUrl)
            ?: filename?.substringAfterLast('.', "")?.lowercase()?.takeIf { it.isNotEmpty() }
        return when (ext) {
            "png" -> "image/png"
            "jpg", "jpeg" -> "image/jpeg"
            "webp" -> "image/webp"
            "gif" -> "image/gif"
            "mp4" -> "video/mp4"
            "webm" -> "video/webm"
            "mov" -> "video/quicktime"
            else -> "image/jpeg"
        }
    }

    private fun extensionFromUrl(fileUrl: String): String? {
        return try {
            val path = URL(fileUrl).path
            val ext = path.substringAfterLast('.', "").lowercase()
            ext.takeIf { it.isNotEmpty() && it.length <= 5 && ext.all { ch -> ch.isLetterOrDigit() } }
        } catch (_: Exception) {
            null
        }
    }

    override fun handleOnDestroy() {
        executor.shutdownNow()
        super.handleOnDestroy()
    }
}
