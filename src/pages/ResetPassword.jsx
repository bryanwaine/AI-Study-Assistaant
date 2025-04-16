import { useState } from "react";
import FormLayout from "../components/FormLayout";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import errorHandler from "../utils/errorHandler";
import useToast from "../hooks/useToast";

const ResetPassword = () => {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    email: "",
  });

  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting");
    try {
      const data = await resetPassword(formData.email);
      setStatus("success");
      showToast("Password reset email sent", "success");
      console.log(data);
    } catch (error) {
      setStatus("error");
      showToast(errorHandler(error), "error");
    }
  };

  return status === "success" ? (
      <FormLayout
          type="reset-password"
          title="Reset Password"
          message="✅ Password reset link sent."
      >
      <p style={{ padding: 0, marginTop: '-1rem' }}>Please check your email for password reset instructions</p>
    </FormLayout>
  ) : (
    <FormLayout
      type="reset-password"
      title="Reset Password"
      message="Please enter your email address"
      handleSubmit={handleSubmit}
    >
      <TextInput
        label="Email"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        handleChange={handleChange}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={status === "Submitting"}
      >
        {" "}
        {status === "Submitting" ? "Sending Reset Email" : "Send Reset Email"}
      </Button>
    </FormLayout>
  );
};

export default ResetPassword;
