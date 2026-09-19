package ir.lontra.hamdast;

import com.getcapacitor.BridgeActivity;

/** Myket flavor: register Myket IAB only. */
public final class StoreBillingPlugin {
    private StoreBillingPlugin() {}

    public static void register(BridgeActivity activity) {
        activity.registerPlugin(MyketPayPlugin.class);
    }
}
