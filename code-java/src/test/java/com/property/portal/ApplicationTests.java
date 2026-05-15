package com.property.portal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
        "ml.api.url=http://localhost:9999",
        "cors.allowed-origins=http://localhost:3000"
})
class ApplicationTests {

    @Test
    void contextLoads() {
    }
}
