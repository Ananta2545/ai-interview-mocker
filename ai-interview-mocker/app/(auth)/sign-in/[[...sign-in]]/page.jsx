import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex relative">
      {/* Left Side - Image (hidden on small screens) */}
      <div
        className="hidden md:block md:w-1/2 h-[50vh] md:h-auto relative bg-cover bg-center"
        style={{ backgroundImage: "url('/authImage.png')" }}
      >
        {/* Text Overlay at Bottom */}
        <div className="absolute bottom-6 left-6 right-6 bg-black/40 p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to the Interview Mocker
          </h2>
          <p className="text-white/90 text-sm">
            Prepare for your dream job with realistic coding and technical interviews.
            Practice, learn, and track your progress with our AI-powered mock interview platform.
          </p>
        </div>
      </div>

      {/* Right Side - SignIn */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-gray-50 z-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
          <SignIn appearance={{ layout: { socialButtonsPlacement: 'bottom' }  }} />
        </div>
      </div>

      {/* Mobile background image (only on small screens) */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center blur-sm brightness-75 z-0"
        style={{ backgroundImage: "url('/authImage.png')" }}
        aria-hidden="true"
      >
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome to the Interview Mocker
          </h2>
          <p className="text-white/90 text-sm">
            Prepare for your dream job with realistic coding and technical interviews.
            Practice, learn, and track your progress with our AI-powered mock interview platform.
          </p>
        </div>
      </div>
    </div>
  );
}
