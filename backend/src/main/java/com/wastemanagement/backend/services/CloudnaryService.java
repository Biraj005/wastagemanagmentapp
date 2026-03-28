package com.wastemanagement.backend.services;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudnaryService {
    private final Cloudinary cloudinary;

    public Map upload(MultipartFile file) {

        try {
            Map data =   this.cloudinary.uploader().upload(file.getBytes(),Map.of(
            ));
            return data;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
