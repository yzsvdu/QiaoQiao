package com.vnnsnnt.qiaoqiao.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class TableIdentifierGenerator {
    private static final String FIXED_SALT = "sana's-protector";

    public static String generateTableIdentifier(String tableName) {
        try {
            // Combine fixed salt and table name
            String saltedTableName = FIXED_SALT + tableName;

            // Hash the combined value
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(saltedTableName.getBytes(StandardCharsets.UTF_8));

            // Convert hash to a hexadecimal string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }
}