import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const res = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Failed to fetch profile.");
          if (data.message === "Token expired" || data.message === "Unauthorized") {
            // If the token is expired or invalid, redirect to login
            localStorage.removeItem("token");
            router.push("/auth/login");
          }
        } else {
          setUser(data.user);
        }
      } catch (err) {
        setErrorMsg("Something went wrong while fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Cleanup the async function if the component unmounts
    return () => {
      setLoading(false);
      setErrorMsg("");
    };
  }, [router]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (errorMsg) return <div className="p-4 text-red-600">{errorMsg}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">User Profile</h2>

        {/* Avatar */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-md border border-gray-200">
            <span className="text-2xl font-bold text-gray-800">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-left text-gray-700 text-lg">
          <p>
            <span className="font-semibold text-blue-600">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-semibold text-blue-600">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-semibold text-blue-600">Role:</span> {user?.role}
          </p>
          <p>
            <span className="font-semibold text-blue-600">User ID:</span> {user?.id}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("storage")); // notify other tabs or components
            router.push("/auth/login");
          }}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout 🚪
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
