import { AdminSignupForm } from "@/components/domain/admin-signup-form";

export default function AdminSignupPage() {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          Apply for Admin Access
        </h2>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Your account will require approval from an existing administrator.
        </p>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <AdminSignupForm />
      </div>
    </div>
  );
}
