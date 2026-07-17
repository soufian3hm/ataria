import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "@/app/actions";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "تسجيل الدخول | عطارية فدك",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const sp = await searchParams;

  return (
    <main className="auth-shell">
      <div className="aurora" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <form action={login} className="auth-card">
        <div className="auth-mono">فدك</div>
        <h1>لوحة التحكم</h1>
        <p className="muted">أدخل كلمة المرور للمتابعة</p>

        {sp.error ? <p className="error">كلمة المرور غير صحيحة، حاول مجدداً</p> : null}

        <input
          className="input"
          dir="ltr"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          autoFocus
        />
        <button className="btn-gold" type="submit">
          دخول
        </button>

        <a className="back-link" href="/">
          العودة إلى الصفحة الرئيسية
        </a>
      </form>
    </main>
  );
}
