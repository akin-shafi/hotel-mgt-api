"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailFooter = emailFooter;
// emailFooter.js
function emailFooter() {
    return `
      
        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <div style="
                display: inline-flex;
                justify-content: center;
                gap: 15px;
                align-items: center;
            ">
              <a href="https://instagram.com/use_nidi" style="color: #000000; text-decoration: none;">
                <img src="https://res.cloudinary.com/dhcikhvpu/image/upload/v1728681342/COPORA_IG_oc5r7i.png" alt="Instagram" style="width: 24px; height: 24px;">
              </a>
              <a href="https://x.com/usenidi?s=21&t=DJhnfOr8u2WipeCDcSFy9A" style="color: #000000; text-decoration: none;">
                <img src="https://res.cloudinary.com/dhcikhvpu/image/upload/v1728681342/COPORA_X_gkddqh.png" alt="X (Twitter)" style="width: 24px; height: 24px;">
              </a>
              <a href="https://www.linkedin.com/company/usenidi/" style="color: #000000; text-decoration: none;">
                <img src="https://res.cloudinary.com/dhcikhvpu/image/upload/v1728681653/COPORA_IN_mw4ldq_p6kjvr.png" alt="LinkedIn" style="width: 24px; height: 24px;">
              </a>
              
            </div>
                
            <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} ${process.env.APP_COMPANY}. All rights reserved.</p>
            <p style="font-size: 12px; color: #777;">${process.env.APP_ADDRESS}</p>
            <p style="font-size: 12px; color: #777;">If you have any questions, contact us at <a href="mailto:${process.env.APP_COMPANY_EMAIL}" style="color: #007BFF; text-decoration: none;">${process.env.APP_COMPANY_EMAIL}</a></p>
        </div>
      </div>
    </div>
  `;
}
