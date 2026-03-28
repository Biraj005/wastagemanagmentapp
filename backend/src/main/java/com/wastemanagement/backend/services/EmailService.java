package com.wastemanagement.backend.services;

import com.wastemanagement.backend.util.EmailTemplateUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    @PostConstruct
    public void testEnv() {
        System.out.println("EMAIL: " + System.getenv("EMAIL"));
        System.out.println("EMAIL_PASSWORD: " + System.getenv("EMAIL_PASSWORD"));
    }
    public void sendOtp(String toEmail, String username, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP");

            String htmlContent = EmailTemplateUtil.buildOtpEmail(username, otp);

            helper.setText(htmlContent, true); // TRUE = HTML

            mailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 IMPORTANT
            throw new RuntimeException(e.getMessage());
        }
    }
}