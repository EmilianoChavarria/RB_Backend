# 📌 Sistema de Invitaciones Digitales - Backend  

**Plataforma para generar, personalizar y enviar invitaciones digitales con confirmación de asistencia.**  

---

## 🚀 Introducción  
Este proyecto es el **backend** (API REST) de un sistema que permite a los usuarios:  
- Generar invitaciones en **PDF/imagen** a partir de plantillas personalizables.  
- Enviar invitaciones por **email** o **WhatsApp**.  
- Gestionar confirmaciones de asistencia con **formularios dinámicos**.  

---

## 🛠 Tecnologías  

| **Categoría**       | **Tecnologías**                                                                 |  
|----------------------|---------------------------------------------------------------------------------|  
| **Lenguaje**         | Node.js (JavaScript/TypeScript)                                                 |  
| **Framework**        | Express.js                                                                      |  
| **Base de Datos**    | MySQL                                                                          |
| **Query Builder**         | Knex.js                                                                   |
| **Autenticación**    | JWT + Bcrypt                                                                   |  
| **Envío de Emails**  | Nodemailer                                                                     |  
| **WhatsApp**         | Twilio API                                                                      |  
| **Validación**       | Joi o express-validator                                                       |  

---

## 📂 Estructura de Carpetas  

```bash
src/
├── controllers/       
├── routes/            
├── services/          
├── utils/             
├── config/            
└── app.js             
assets/
README.md
