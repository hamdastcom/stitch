import React from "react";

import { Spinner } from "@/components/ui/spinner";

function CheckHamdastLogin() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <img src="/logo.png" alt="Hamdast AI" className="size-8" />
            </div>

            <span className="sr-only">Hamdast AI</span>
          </div>

          <h1 className="text-xl font-bold">به پلتفرم هوش مصنوعی همدست خوش آمدید</h1>
          <p className="text-sm text-muted-foreground">
            در حال بررسی حساب کاربری...
          </p>

          <div className="flex items-center justify-center pt-4">
            <Spinner className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckHamdastLogin;
