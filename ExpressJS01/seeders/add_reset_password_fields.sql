-- Migration: Add reset password fields to users table
-- Description: Add resetPasswordToken and resetPasswordTokenExpiry columns to support forgot password functionality

ALTER TABLE users ADD COLUMN resetPasswordToken VARCHAR(255) NULL DEFAULT NULL;
ALTER TABLE users ADD COLUMN resetPasswordTokenExpiry DATETIME NULL DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX idx_reset_password_token ON users(resetPasswordToken);
