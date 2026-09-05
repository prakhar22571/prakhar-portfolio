import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import { updatePassword } from "@/store/slices/userSlice";
import { useMutation } from "@/hooks/use-mutation";
export default function UpdatePassword() {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const loading = useSelector((state) => state.user.loading);
  const mutate = useMutation();
  async function submit(event) {
    event.preventDefault();
    if (values.newPassword !== values.confirmNewPassword) {
      event.currentTarget.elements.confirmNewPassword.setCustomValidity(
        "Passwords do not match.",
      );
      event.currentTarget.reportValidity();
      return;
    }
    if (
      await mutate(
        updatePassword(
          values.currentPassword,
          values.newPassword,
          values.confirmNewPassword,
        ),
        "Password updated.",
      )
    )
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
  }
  return (
    <form className="grid gap-4" onSubmit={submit}>
      <h1 className="text-3xl font-bold">Update password</h1>
      {Object.entries({
        currentPassword: "Current password",
        newPassword: "New password",
        confirmNewPassword: "Confirm new password",
      }).map(([key, label]) => (
        <label key={key} className="grid gap-2">
          {label}
          <Input
            name={key}
            type="password"
            autoComplete={
              key === "currentPassword" ? "current-password" : "new-password"
            }
            minLength={key === "currentPassword" ? undefined : 8}
            required
            value={values[key]}
            onChange={(event) => {
              event.target.setCustomValidity("");
              setValues((old) => ({ ...old, [key]: event.target.value }));
            }}
          />
        </label>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update password"}
      </Button>
    </form>
  );
}
