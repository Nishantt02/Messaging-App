import { render } from "@react-email/render";
import VerificationEmail from "../../email/VerificationEmail";

export async function renderVerificationEmail(username: string, otp: string) {
  return render(<VerificationEmail username={username} otp={otp} />);
}
