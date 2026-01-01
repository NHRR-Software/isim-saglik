# AuthController, CompanyController, HealthProfileController, AssignmentController, SafetyFindingController ve UserController API Dokümantasyonu

Bu doküman, frontend geliştiricisinin Auth, Company, HealthProfile, Assignment, SafetyFinding ve User ile ilgili API isteklerini doğru şekilde yapabilmesi için hazırlanmıştır. Her endpoint için:
- **Açıklama**
- **HTTP Yöntemi ve URL**
- **İstek Gövdesi (Request Body)**
- **Yanıt Tipi (Response)**
- **Başarı ve hata durumları**
- **Bearer Token gereksinimi**
bilgileri yer almaktadır.

---

## AuthController (`/api/auth`)

### 1. Şirket Kaydı (Register Company)
- **Açıklama:** Yeni bir şirket ve şirket yöneticisi (admin) kaydı oluşturur.
- **Yöntem & URL:** `POST /api/auth/register-company`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "password": "string",
      "passwordAgain": "string",
      "foundingDate": "2024-01-01T00:00:00Z"
    }
    ```
- **Response:**
    ```json
    {
      "status": 201,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Company registered successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 2. Davet ile Kayıt (Register With Invite)
- **Açıklama:** Davet edilen kullanıcı, davet linkiyle kayıt olur.
- **Yöntem & URL:** `POST /api/auth/register-with-invite`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "accessToken": "string",
      "fullName": "string",
      "password": "string",
      "passwordAgain": "string",
      "gender": 0, // 0: None, 1: Male, 2: Female
      "phoneNumber": "string",
      "birthDate": "2024-01-01T00:00:00Z"
    }
    ```
- **Response:**
    ```json
    {
      "status": 201,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "User registered successfully with invitation.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 3. Giriş Yap (Login)
- **Açıklama:** Kullanıcı giriş işlemi yapar, token alır.
- **Yöntem & URL:** `POST /api/auth/login`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "accessToken": "string",
        "refreshToken": "string"
      },
      "error": null,
      "message": "Login successful.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 4. Token Yenile (Refresh Token)
- **Açıklama:** Refresh token ile yeni access ve refresh token alır.
- **Yöntem & URL:** `POST /api/auth/refresh-token`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "token": "string" // 44 karakterlik refresh token
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "accessToken": "string",
        "refreshToken": "string"
      },
      "error": null,
      "message": "Token refreshed successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 5. Şifre Sıfırlama Maili Gönder (Forgot Password)
- **Açıklama:** Şifre sıfırlama maili gönderir.
- **Yöntem & URL:** `POST /api/auth/forgot-password`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "email": "string"
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Password reset email sent successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 6. Şifre Sıfırla (Reset Password)
- **Açıklama:** Kullanıcı, şifre sıfırlama linkiyle yeni şifresini belirler.
- **Yöntem & URL:** `POST /api/auth/reset-password`
- **Bearer Token:** GEREKMEZ
- **Request Body:**
    ```json
    {
      "accessToken": "string",
      "password": "string",
      "passwordAgain": "string"
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Password has been reset successfully. You can now login.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 7. Çıkış Yap (Logout)
- **Açıklama:** Kullanıcı çıkış yapar, refresh token silinir.
- **Yöntem & URL:** `POST /api/auth/logout`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "token": "string" // 44 karakterlik refresh token
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Logout successful.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## CompanyController (`/api/company`)

### 1. Kullanıcı Davet Et (Invite User)
- **Açıklama:** Şirkete yeni bir kullanıcı davet eder.
- **Yöntem & URL:** `POST /api/company/invite-user`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "email": "string",
      "role": 0 // 0: Admin, 1: Company, 2: Expert, 3: Worker
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "User invited successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## HealthProfileController (`/api/health-profiles`)

### 1. Sağlık Profili Getir (Get Health Profile)
- **Açıklama:** Kullanıcının sağlık profilini getirir.
- **Yöntem & URL:** `GET /api/health-profiles`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "bloodGroup": "A+",
        "weight": 70.5,
        "height": 175.0,
        "chronicDisease": "Astım"
      },
      "error": null,
      "message": "Health profile retrieved successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 2. Sağlık Profili Oluştur (Create Health Profile)
- **Açıklama:** Kullanıcı için yeni bir sağlık profili oluşturur.
- **Yöntem & URL:** `POST /api/health-profiles`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "bloodGroup": "A+",
      "weight": 70.5,
      "height": 175.0,
      "chronicDisease": "Astım"
    }
    ```
- **Response:**
    ```json
    {
      "status": 201,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Health profile created successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 3. Sağlık Profili Güncelle (Update Health Profile)
- **Açıklama:** Kullanıcının sağlık profilini günceller.
- **Yöntem & URL:** `PUT /api/health-profiles`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "bloodGroup": "A+",
      "weight": 70.5,
      "height": 175.0,
      "chronicDisease": "Astım"
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Health profile updated successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## AssignmentController (`/api/assignments`)

### 1. Görevları Listele (Get All Assignments)
- **Açıklama:** Kullanıcıya ait tüm Görevları listeler.
- **Yöntem & URL:** `GET /api/assignments`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": [
        {
          "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
          "status": 0, // 0: Pending, 1: Approved, 2: Rejected, 3: Completed
          "description": "Açıklama örneği",
          "severity": 1, // 0: Low, 1: Medium, 2: High
          "createdDate": "2024-01-01T00:00:00Z"
        }
      ],
      "error": null,
      "message": "Assignments retrieved successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 2. Görev Oluştur (Create Assignment)
- **Açıklama:** Yeni bir Görev oluşturur.
- **Yöntem & URL:** `POST /api/assignments`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "description": "Açıklama örneği",
      "severity": 1 // 0: Low, 1: Medium, 2: High
    }
    ```
- **Response:**
    ```json
    {
      "status": 201,
      "isSuccess": true,
      "data": {
        "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
        "status": 0, // 0: Pending, 1: Approved, 2: Rejected, 3: Completed
        "description": "Açıklama örneği",
        "severity": 1, // 0: Low, 1: Medium, 2: High
        "createdDate": "2024-01-01T00:00:00Z"
      },
      "error": null,
      "message": "Assignment created successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 3. Görev Güncelle (Update Assignment)
- **Açıklama:** Belirtilen Görevyı günceller.
- **Yöntem & URL:** `PUT /api/assignments/{id}`
- **Bearer Token:** GEREKLİ
- **Request Body:**
    ```json
    {
      "description": "Açıklama örneği",
      "severity": 1 // 0: Low, 1: Medium, 2: High
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
        "status": 0, // 0: Pending, 1: Approved, 2: Rejected, 3: Completed
        "description": "Açıklama örneği",
        "severity": 1, // 0: Low, 1: Medium, 2: High
        "createdDate": "2024-01-01T00:00:00Z"
      },
      "error": null,
      "message": "Assignment updated successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 4. Görev Sil (Delete Assignment)
- **Açıklama:** Belirtilen Görevyı siler.
- **Yöntem & URL:** `DELETE /api/assignments/{id}`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Assignment deleted successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## SafetyFindingController (`/api/safety-findings`)

### 1. İş Sağlığı ve Güvenliği Bulgularını Listele (Get All Safety Findings)
- **Açıklama:** Kullanıcıya ait tüm iş sağlığı ve güvenliği bulgularını listeler.
- **Yöntem & URL:** `GET /api/safety-findings`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": [
        {
          "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
          "title": "Kırık merdiven",
          "status": 1, // 0: Closed, 1: Open
          "severity": 2, // 0: Low, 1: Medium, 2: High, 3: Critical
          "type": 0, // 0: SafetyBehavioral, 1: SafetyTechnical, 2: FireEmergency, 3: HygieneHealth, 4: Environmental, 5: Documentation
          "description": "Merdiven kırık, tehlike arz ediyor.",
          "photoUrl": "https://...",
          "reportedId": null,
          "closedDate": null
        }
      ],
      "error": null,
      "message": "Safety findings retrieved successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 2. İş Sağlığı ve Güvenliği Bulgusu Oluştur (Create Safety Finding)
- **Açıklama:** Yeni bir iş sağlığı ve güvenliği bulgusu raporlar. (Sadece Expert rolü)
- **Yöntem & URL:** `POST /api/safety-findings`
- **Bearer Token:** GEREKLİ (Expert)
- **Request Body:**
    ```json
    {
      "title": "Kırık merdiven",
      "status": 1, // 0: Closed, 1: Open
      "severity": 2, // 0: Low, 1: Medium, 2: High, 3: Critical
      "type": 0, // 0: SafetyBehavioral, 1: SafetyTechnical, 2: FireEmergency, 3: HygieneHealth, 4: Environmental, 5: Documentation
      "description": "Merdiven kırık, tehlike arz ediyor.",
      "base64Image": "string",
      "reportedId": "string (Guid) veya null"
    }
    ```
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
        "title": "Kırık merdiven",
        "status": 1, // 0: Closed, 1: Open
        "severity": 2, // 0: Low, 1: Medium, 2: High, 3: Critical
        "type": 0, // 0: SafetyBehavioral, 1: SafetyTechnical, 2: FireEmergency, 3: HygieneHealth, 4: Environmental, 5: Documentation
        "description": "Merdiven kırık, tehlike arz ediyor.",
        "photoUrl": "https://...",
        "reportedId": null,
        "closedDate": null
      },
      "error": null,
      "message": "Safety finding reported successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 3. İş Sağlığı ve Güvenliği Bulgusunu Tamamla (Mark Safety Finding as Completed)
- **Açıklama:** Belirtilen bulguyu tamamlanmış olarak işaretler. (Sadece Company rolü)
- **Yöntem & URL:** `PATCH /api/safety-findings/{id}/complete`
- **Bearer Token:** GEREKLİ (Company)
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Safety finding marked as completed.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 4. İş Sağlığı ve Güvenliği Bulgusunu Sil (Delete Safety Finding)
- **Açıklama:** Belirtilen bulguyu siler. (Sadece Company rolü)
- **Yöntem & URL:** `DELETE /api/safety-findings/{id}`
- **Bearer Token:** GEREKLİ (Company)
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": null,
      "error": null,
      "message": "Safety finding deleted successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## UserController (`/api/users`)

### 1. Kullanıcı Profilini Getir (Get User Profile)
- **Açıklama:** Giriş yapan kullanıcının profil bilgilerini getirir.
- **Yöntem & URL:** `GET /api/users`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
        "email": "user@example.com",
        "fullName": "Ad Soyad",
        "phoneNumber": "5551234567",
        "jobTitle": "Uzman",
        "gender": 1, // 0: None, 1: Male, 2: Female
        "role": 2, // 0: Admin, 1: Company, 2: Expert, 3: Worker
        "birthDate": "1990-01-01T00:00:00Z",
        "photoUrl": "https://...",
        "isSetupCompleted": true
      },
      "error": null,
      "message": "User profile retrieved successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

### 2. Kullanıcı Ara (Search User)
- **Açıklama:** E-posta adresine göre kullanıcı arar.
- **Yöntem & URL:** `GET /api/users/search?email={email}`
- **Bearer Token:** GEREKLİ
- **Request Body:** YOK
- **Response:**
    ```json
    {
      "status": 200,
      "isSuccess": true,
      "data": {
        "id": "b1a7e8c2-1d2f-4c3a-9e2b-123456789abc",
        "fullName": "Ad Soyad",
        "email": "user@example.com",
        "role": 2, // 0: Admin, 1: Company, 2: Expert, 3: Worker
        "photoUrl": "https://..."
      },
      "error": null,
      "message": "User found successfully.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

---

## Genel Notlar

- **Başarılı Yanıtlar:** `isSuccess: true`, `error: null`
- **Hatalı Yanıtlar:** `isSuccess: false`, `data: null`, `error` alanı dolu olur. Örnek:
    ```json
    {
      "status": 400,
      "isSuccess": false,
      "data": null,
      "error": {
        "code": "UserAlreadyExists",
        "message": "User already exists.",
        "details": null,
        "timestamp": "2024-01-01T00:00:00Z"
      },
      "message": "User already exists.",
      "timestamp": "2024-01-01T00:00:00Z"
    }
    ```

- **Tüm endpointler JSON formatında request ve response bekler/gönderir.**
- **Tarih alanları ISO 8601 formatında olmalıdır.**
- **Bearer Token gereken endpointlerde, HTTP Header'a şu şekilde eklenmelidir:**
    ```
    Authorization: Bearer {accessToken}
    ```
- **Bazı endpointler için Authorization (Bearer Token) gereklidir, yukarıda belirtildi.**