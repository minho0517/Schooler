import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PW,
    },
});

export async function sendEmail({ email, number }) {
    try {
        const mailData = {
            to: email,
            subject: `스쿨러 인증번호 [${number}]`,
            from: `스쿨러 <${process.env.GMAIL_USER}>`,
            html: `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:600px" class="m_-8540489507672767446email-container">
                    <tbody>
                    <tr>
                        <td bgcolor="#FFFFFF">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" align="center">
                                <tbody>
                                <tr>
                                    <td style="padding:20px 40px 20px 40px;text-align:center">
                                        <h1 style="margin:0;font-family:'Roboto','Arial',sans-serif;font-size:28px;line-height:40px;color:#333333;font-weight:bold;letter-spacing:0px">인증번호를 확인해주세요</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0px 30px 20px 30px;font-family:'Roboto',sans-serif;font-size:17px;line-height:20px;color:#555555;text-align:center;font-weight:300">
                                        <p style="margin:0 0 5px 0">아래 <span class="il">인증</span> <span class="il">번호</span>를 입력해주세요.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:20px 40px 40px 40px;text-align:center" align="center">
                                        <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" class="m_-8540489507672767446center-on-narrow">
                                            <tbody><tr>
                                                <td style="border-radius:8px;background:#ffffff;text-align:center">
                                                    <div style="background:#ffffff;border:2px solid #e2e2e2;font-family:'Roboto',sans-serif;font-size:30px;line-height:1.1;text-align:center;text-decoration:none;display:block;border-radius:8px;font-weight:bold;padding:10px 40px">
                                                        <span style="color:#333;letter-spacing:5px">${number}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#fff">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#FFFFFF" style="border-top:1px solid #e2e2e2">
                                <tbody><tr>
                                    <td style="padding:30px 30px;text-align:center;font-family:'Roboto',sans-serif;font-size:15px;line-height:20px">
                                        <table align="center" style="text-align:center">
                                            <tbody><tr>
                                                <td style="font-family:'Roboto',sans-serif;font-size:12px;line-height:20px;color:#555555;text-align:center;font-weight:300">
                                                    <p class="m_-8540489507672767446disclaimer" style="margin-bottom:5px">스쿨러에서 인증을 위해 발송된 이메일입니다. 스쿨러에서 인증요청을 시도하지 않았다면, 이 이메일을 무시해주세요.</p>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>  

                </tbody></table>
            `,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({success : true});
                }
            });
        });

    } catch (err) {
        return err
    }
}

                    // <tr>
                    //     <td bgcolor="#000000">
                    //         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    //             <tbody><tr>
                    //                 <td align="left" style="padding:40px 10px 40px 40px;font-family:'Roboto',sans-serif;font-size:14px;line-height:20px;color:#ffffff;text-align:left;font-weight:300">
                    //                     <p style="margin:0 0 10px 0"><a href="https://supercell.com/en/terms-of-service/ko/" style="color:#ffffff;font-size:12px;font-weight:bold;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://supercell.com/en/terms-of-service/ko/&amp;source=gmail&amp;ust=1699639642702000&amp;usg=AOvVaw2oodaGEahr0KOwC4zfZEYI">이용 약관</a></p>
                    //                     <p style="margin:0"><a href="https://supercell.com/en/privacy-policy/ko/" style="color:#ffffff;font-size:12px;font-weight:bold;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://supercell.com/en/privacy-policy/ko/&amp;source=gmail&amp;ust=1699639642702000&amp;usg=AOvVaw3ncY-LuVwHzThE9Do7Vjoi">개인정보 보호정책</a></p>
                    //                 </td>
                    //                 <td align="right" style="padding:40px 40px 40px 10px;text-align:right">
                    //                     <img src="https://ci3.googleusercontent.com/proxy/qGNSfIA7QCRSeFjLjlDFFqWdwteOQR04pcHW4odnSRkc3tcB3-emoTVd8dLki25SU-tFG6J5pEE_SOq4Yirl8uTcCC4pC2iczdowuWo=s0-d-e1-ft#https://cdn.supercell.com/scid-email/v2/supercell-logo.png" alt="Supercell" width="80" height="70" class="CToWUd" data-bit="iit">
                    //                 </td>
                    //             </tr>
                    //         </tbody></table>
                    //     </td>
                    // </tr>