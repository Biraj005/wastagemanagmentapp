package com.wastemanagement.backend.util;

public class EmailTemplateUtil {

    public static String buildOtpEmail(String username, String otp) {

        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 500px;
                    margin: 40px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .header {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                .otp {
                    font-size: 32px;
                    font-weight: bold;
                    color: #4CAF50;
                    margin: 20px 0;
                    letter-spacing: 5px;
                }
                .text {
                    font-size: 14px;
                    color: #666;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Password Reset OTP</div>
                
                <p class="text">Hi %s,</p>
                
                <p class="text">Use the OTP below to reset your password:</p>
                
                <div class="otp">%s</div>
                
                <p class="text">This OTP is valid for 5 minutes.</p>
                
                <p class="text">If you didn’t request this, ignore this email.</p>
                
                <div class="footer">
                    © Waste Management System
                </div>
            </div>
        </body>
        </html>
        """.formatted(username, otp);
    }
}