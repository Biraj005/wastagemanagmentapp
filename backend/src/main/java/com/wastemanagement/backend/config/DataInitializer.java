package com.wastemanagement.backend.config;

import com.wastemanagement.backend.entities.District;
import com.wastemanagement.backend.entities.Role;
import com.wastemanagement.backend.entities.User;
import com.wastemanagement.backend.repositories.DistrictRepository;
import com.wastemanagement.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final DistrictRepository districtRepository;

    private final Role adminRole = Role.ADMIN;
    @Value("${ADMIN_PASSWORD}")
    private  String password;
    @Value("${ADMIN_EMAIL}")
    private  String adminEmail;
    @Value("${DISTRICT_NAME}")
    private  String districtName;


    @Override
    public void run(String... args) {

        if(adminEmail==null || adminEmail.isEmpty()){
            System.out.println("Admin Email is Empty");
            System.exit(0);
        }
       System.out.println("Admin Email is "+adminEmail);
        System.out.println("Admin Password is "+password);
        if (!userRepository.existsByEmail(adminEmail)) {

            District district = districtRepository.findByName(districtName)
                    .orElseGet(() -> {
                        District newDistrict = new District();
                        newDistrict.setName(districtName);
                        return districtRepository.save(newDistrict);
                    });

            User admin = User.builder()
                    .username("Biraj Roy")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(password))
                    .district(district)
                    .role(adminRole)
                    .build();
            userRepository.save(admin);
        }
    }
}