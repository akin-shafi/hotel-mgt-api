const HEADER_IMAGES = {
  welcome: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724319469/Copora_Welcome_Email_Header_jnhbxk.png',
  temporary_work: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724322808/Copora_Onboarding_Email_Template_ihe8rd.png',
  reminder: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724323730/Copora_Onboarding_Complete_Email_Template_l7vj0z.png',
  complete_email: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724323730/Copora_Onboarding_Complete_Email_Template_l7vj0z.png',
  hospitality_temporary_worker: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724322808/Copora_Onboarding_Email_Template_ihe8rd.png',
  contract_temporary_candidate: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724324008/Copora_Contact_Email_Template_e89iff.png',
  contract_permanent_candidate: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724324008/Copora_Contact_Email_Template_e89iff.png',
  contract_client: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724324008/Copora_Contact_Email_Template_e89iff.png',
  others: 'https://res.cloudinary.com/dgdx2a9cq/image/upload/v1724319469/Copora_Welcome_Email_Header_jnhbxk.png'
};

// export function emailHeader(headerType) {
//   const imageUrl = HEADER_IMAGES[headerType] || HEADER_IMAGES['others'];

//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <link href="https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap" rel="stylesheet">
//   <title>Copora</title>
// </head>
// <body style="
//     font-family: Arial, sans-serif;
//     background-color: #EAF0F3;
//     margin: 0;
//     padding: 0;
//     color: #000;
// ">
//   <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="
//       width: 100%;
//       background-color: #EAF0F3;
//   ">
//     <tr>
//       <td>
//         <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #fff;
//             border-radius: 6px;
//             overflow: hidden;
//         ">
//           <tr>
//             <td style="padding: 20px;">
//               <img src="${imageUrl}" alt="Header Image" style="
//                   width: 100%;
//                   border: none;
//                   display: block;
//                   margin-bottom: 20px;
//               ">
//             </td>
//           </tr>
//   `;
// }

// emailHeader.js
export function emailHeader(headerType: string) {
  const imageUrl = HEADER_IMAGES[headerType] || HEADER_IMAGES['others'];

  return `
    <div style="font-family: Arial, sans-serif;  background-color: #f0f3f7;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="${imageUrl}" alt="Company Logo" style="width: 100%;"/>
          </div>
          
      `;
}

