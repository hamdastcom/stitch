package ir.lontra.hamdast;

import com.getcapacitor.BridgeActivity;

/** Bazaar flavor: register Poolakey billing only. */
public final class StoreBillingPlugin {
    private StoreBillingPlugin() {}

    public static void register(BridgeActivity activity) {
        activity.registerPlugin(BazaarPayPlugin.class);
    }
}
