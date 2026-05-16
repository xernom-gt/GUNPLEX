"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard.module.css";

export default function ProfilePage() {
  const router = useRouter();
  
  // Hardcoded for demo, normally fetched from session/api
  const [adminName, setAdminName] = useState("Admin");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        // Normally you'd PUT this to /api/users/[id]
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g. clearing tokens)
    router.push("/");
  };

  const handleChangeName = () => {
    const newName = prompt("Enter new name:", adminName);
    if (newName && newName.trim() !== "") {
      setAdminName(newName.trim());
      // Normally you'd PUT this to /api/users/[id]
    }
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.profilePhotoContainer}>
        {photo ? (
          <img src={photo} alt="Profile" className={styles.profilePhoto} />
        ) : (
          <div className={styles.photoPlaceholder}>A</div>
        )}
      </div>
      
      <div style={{ marginBottom: "30px" }}>
        <input 
          type="file" 
          id="photo-upload" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handlePhotoUpload}
        />
        <label htmlFor="photo-upload" className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: "pointer", fontSize: "0.8rem" }}>
          Upload New Photo
        </label>
      </div>

      <h2 className={styles.profileName}>{adminName} <button onClick={handleChangeName} style={{ background: 'none', border: 'none', color: '#A0A5AA', cursor: 'pointer', fontSize: '1rem' }}>✏️</button></h2>
      <div style={{ marginBottom: "40px" }}>
        <span className={styles.roleBadgeAdmin}>Admin</span>
      </div>

      <button className={`${styles.btn} ${styles.btnDanger} ${styles.logoutBtn}`} onClick={handleLogout}>
        LOGOUT
      </button>
    </div>
  );
}
