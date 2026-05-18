package com.property.portal.init;

import com.property.portal.entity.Property;
import com.property.portal.mapper.PropertyMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@ConditionalOnProperty(name = "data.init.enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PropertyMapper propertyMapper;

    @Override
    public void run(String... args) throws Exception {
        long count = propertyMapper.selectCount(null);
        if (count > 0) {
            log.info("Database already has {} properties, skipping initialization.", count);
            return;
        }

        log.info("Database is empty, initializing from CSV...");
        List<Property> properties = loadFromCsv();
        if (!properties.isEmpty()) {
            for (Property p : properties) {
                propertyMapper.insert(p);
            }
            log.info("Inserted {} properties into database.", properties.size());
        }
    }

    private List<Property> loadFromCsv() throws Exception {
        List<Property> list = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("house_prices.csv");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String header = reader.readLine();
            if (header == null) {
                return list;
            }
            String line;
            while ((line = reader.readLine()) != null) {
                String[] cols = line.split(",");
                if (cols.length < 9) continue;

                Property p = new Property();
                // cols[0] = id (skip, auto-increment)
                p.setSquareFootage(parseDouble(cols[1]));
                p.setBedrooms(parseInt(cols[2]));
                p.setBathrooms(parseInt(cols[3]));
                p.setYearBuilt(parseInt(cols[4]));
                p.setLotSize(parseDouble(cols[5]));
                p.setDistanceToCityCenter(parseDouble(cols[6]));
                p.setSchoolRating(parseInt(cols[7]));
                p.setActualPrice(parseDouble(cols[8]));
                list.add(p);
            }
        }
        return list;
    }

    private Double parseDouble(String s) {
        try {
            return Double.parseDouble(s.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private Integer parseInt(String s) {
        try {
            return (int) Math.round(Double.parseDouble(s.trim()));
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
