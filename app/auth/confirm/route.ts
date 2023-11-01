import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url));
      // if no error, i.e. OTP is successfully verified, redirect to `next` variable parameter.
      //here next is home page or '/' route. when signed in, homepage redirects to overview page.
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL("/auth/auth-code-error", req.url));
}
