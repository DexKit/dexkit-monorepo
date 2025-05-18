import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/modules/admin/dashboard"), {
  ssr: false,
});

export default AdminApp;
