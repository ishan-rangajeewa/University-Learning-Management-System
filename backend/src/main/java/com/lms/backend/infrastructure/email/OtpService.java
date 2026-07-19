package com.lms.backend.infrastructure.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Component
@Slf4j
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long EXPIRY_MINUTES = 5;

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateOtp(String email) {
        String otp = String.format("%0" + OTP_LENGTH + "d", random.nextInt((int) Math.pow(10, OTP_LENGTH)));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);
        otpStore.put(email, new OtpEntry(otp, expiresAt));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);

        if (entry == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(entry.expiresAt())) {
            otpStore.remove(email);
            return false;
        }
        if (!entry.otp().equals(otp)) {
            return false;
        }

        otpStore.remove(email);
        return true;
    }

    private record OtpEntry(String otp, LocalDateTime expiresAt) {
    }
}