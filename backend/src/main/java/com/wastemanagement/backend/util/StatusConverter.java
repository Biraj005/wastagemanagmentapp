package com.wastemanagement.backend.util;

import com.wastemanagement.backend.entities.Status;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StatusConverter implements Converter<String, Status> {
    @Override
    public Status convert(String source) {
        if (source.equalsIgnoreCase("RESOLVED")) {
            return Status.COMPLETED;
        }
        return Status.valueOf(source.toUpperCase());
    }
}