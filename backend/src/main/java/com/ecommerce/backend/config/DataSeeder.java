package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.entity.enums.*;
import com.ecommerce.backend.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;
    private final AdminRepository adminRepository;
    private final SellerRepository sellerRepository;
    private final CustomerRepository customerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final WalletRepository walletRepository;
    private final RewardPointsRepository rewardPointsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        log.info("🚀 Starting Database Seeding...");

        seedSuperAdmin();
        seedCategories();
        seedAdmin();
        Customer customer = seedCustomer();
        seedCustomerExtras(customer);
        seedSellerAndProducts();
        seedCoupons();

        log.info("✅ Database Seeding Completed");
    }

    private void seedSuperAdmin() {

        if (!userRepository.existsByEmail("superadmin@marketplace.com")) {

            User user = userRepository.save(
                    User.builder()
                            .email("superadmin@marketplace.com")
                            .password(passwordEncoder.encode("SuperAdmin@123"))
                            .role(UserRole.ROLE_SUPER_ADMIN)
                            .build()
            );

            superAdminRepository.save(
                    SuperAdmin.builder()
                            .user(user)
                            .name("Super Administrator")
                            .build()
            );

            log.info("✅ Super Admin created");
        }
    }

    private void seedCategories() {

        List<String> categories = List.of(
                "Electronics",
                "Fashion",
                "Home & Garden",
                "Sports & Outdoors",
                "Books",
                "Toys & Games",
                "Health & Beauty",
                "Automotive",
                "Food & Beverage",
                "Art & Crafts"
        );

        for (String name : categories) {

            if (!categoryRepository.existsByName(name)) {

                categoryRepository.save(
                        Category.builder()
                                .name(name)
                                .description("Products in " + name)
                                .build()
                );
            }
        }

        log.info("✅ Categories seeded");
    }

    private void seedAdmin() {

        if (!userRepository.existsByEmail("admin@marketplace.com")) {

            User user = userRepository.save(
                    User.builder()
                            .email("admin@marketplace.com")
                            .password(passwordEncoder.encode("Admin@123"))
                            .role(UserRole.ROLE_ADMIN)
                            .build()
            );

            adminRepository.save(
                    Admin.builder()
                            .user(user)
                            .name("System Administrator")
                            .phone("1234567890")
                            .build()
            );

            log.info("✅ Admin created");
        }
    }

    private Customer seedCustomer() {

        Customer customer;

        if (!userRepository.existsByEmail("customer@marketplace.com")) {

            User user = userRepository.save(
                    User.builder()
                            .email("customer@marketplace.com")
                            .password(passwordEncoder.encode("Customer@123"))
                            .role(UserRole.ROLE_CUSTOMER)
                            .build()
            );

            customer = customerRepository.save(
                    Customer.builder()
                            .user(user)
                            .name("John Doe")
                            .phone("5554443333")
                            .address("789 Street, City, Country")
                            .build()
            );

            log.info("✅ Customer created");

        } else {

            customer = customerRepository
                    .findByUserEmail("customer@marketplace.com")
                    .get();
        }

        return customer;
    }

    private void seedCustomerExtras(Customer customer) {

        if (cartRepository.findByCustomerCustomerId(customer.getCustomerId()).isEmpty()) {

            cartRepository.save(
                    Cart.builder()
                            .customer(customer)
                            .build()
            );

            log.info("✅ Cart created");
        }

        if (walletRepository.findByCustomerCustomerId(customer.getCustomerId()).isEmpty()) {

            walletRepository.save(
                    Wallet.builder()
                            .customer(customer)
                            .build()
            );

            log.info("✅ Wallet created");
        }

        if (rewardPointsRepository.findByCustomerCustomerId(customer.getCustomerId()).isEmpty()) {

            rewardPointsRepository.save(
                    RewardPoints.builder()
                            .customer(customer)
                            .build()
            );

            log.info("✅ Reward points created");
        }
    }

    private void seedSellerAndProducts() {

        if (!userRepository.existsByEmail("seller@marketplace.com")) {

            User user = userRepository.save(
                    User.builder()
                            .email("seller@marketplace.com")
                            .password(passwordEncoder.encode("Seller@123"))
                            .role(UserRole.ROLE_SELLER)
                            .build()
            );

            Seller seller = sellerRepository.save(
                    Seller.builder()
                            .user(user)
                            .storeName("Urban Trends")
                            .phone("9876543210")
                            .businessAddress("123 Business Park, Tech City")
                            .status(SellerStatus.ACTIVE)
                            .build()
            );

            log.info("✅ Seller created");

            Category electronics = categoryRepository.findByName("Electronics").orElse(null);
            Category fashion = categoryRepository.findByName("Fashion").orElse(null);

            if (electronics != null) {

                productRepository.save(
                        Product.builder()
                                .name("Premium Wireless Headphones")
                                .description("Noise cancellation headphones")
                                .price(new BigDecimal("199.99"))
                                .stock(50)
                                .status(ProductStatus.ACTIVE)
                                .category(electronics)
                                .seller(seller)
                                .build()
                );

                productRepository.save(
                        Product.builder()
                                .name("Smart Fitness Watch")
                                .description("Track health and workouts")
                                .price(new BigDecimal("89.50"))
                                .stock(100)
                                .status(ProductStatus.ACTIVE)
                                .category(electronics)
                                .seller(seller)
                                .build()
                );
            }

            if (fashion != null) {

                productRepository.save(
                        Product.builder()
                                .name("Classic Denims")
                                .description("Timeless style jeans")
                                .price(new BigDecimal("59.00"))
                                .stock(200)
                                .status(ProductStatus.ACTIVE)
                                .category(fashion)
                                .seller(seller)
                                .build()
                );
            }

            log.info("✅ Sample products created");
        }
    }

    private void seedCoupons() {

        if (couponRepository.count() == 0) {

            couponRepository.save(
                    Coupon.builder()
                            .code("WELCOME10")
                            .discountType(CouponDiscountType.PERCENTAGE)
                            .discountValue(new BigDecimal("10"))
                            .minimumOrderAmount(new BigDecimal("500"))
                            .expiryDate(LocalDateTime.now().plusMonths(6))
                            .usageLimit(100)
                            .usedCount(0)
                            .build()
            );

            couponRepository.save(
                    Coupon.builder()
                            .code("FLAT50")
                            .discountType(CouponDiscountType.FLAT)
                            .discountValue(new BigDecimal("50"))
                            .minimumOrderAmount(new BigDecimal("1000"))
                            .expiryDate(LocalDateTime.now().plusMonths(6))
                            .usageLimit(100)
                            .usedCount(0)
                            .build()
            );

            log.info("✅ Coupons seeded");
        }
    }
}
