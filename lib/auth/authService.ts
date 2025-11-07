// Authentication service for real users
import { databaseService } from '../database/databaseService';
import { emailService } from '../email/emailService';
import { User } from '../database/models';

// Simplified auth without bcrypt/jwt for demo purposes
const SIMPLE_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await databaseService.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Simple password hashing (for demo - use bcrypt in production)
    const passwordHash = this.simpleHash(data.password);

        // Create user (always requires verification)
    const user = await databaseService.createUser({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      passwordHash,
      isVerified: false, // Always require verification
    });

    // Generate verification token
    const verificationToken = this.generateToken(user.id);

    // Send verification email
    try {
      await emailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationToken,
      });
      console.log(`Verification email sent to ${user.email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Delete user if email fails to send
      await databaseService.deleteUser(user.id);
      throw new Error('Failed to send verification email. Please check your email address and try again.');
    }

    // Generate auth token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    // Find user by email
    const user = await databaseService.getUserByEmail(data.email.toLowerCase().trim());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password (simple comparison for demo)
    const isPasswordValid = this.simpleHash(data.password) === user.passwordHash;
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
    }

    // Generate auth token
    const token = this.generateToken(user.id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const userId = await this.verifyToken(token);
      if (!userId) return false;

      const user = await databaseService.updateUser(userId, { isVerified: true });
      if (!user) return false;

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user.email, user.name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyToken(token: string): Promise<string | null> {
    try {
      // Simple token verification (use JWT in production)
      const [userId, timestamp] = token.split('.');
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      
      // Check if token is less than 24 hours old
      if (now - tokenTime > 24 * 60 * 60 * 1000) {
        return null;
      }
      
      return userId;
    } catch (error) {
      return null;
    }
  }

  async getUserFromToken(token: string): Promise<Omit<User, 'passwordHash'> | null> {
    const userId = this.verifyToken(token);
    if (!userId) return null;

    const user = await databaseService.getUserById(await userId);
    return user ? this.sanitizeUser(user) : null;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await databaseService.getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    // Generate reset token
    const resetToken = this.generateToken(user.id);

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetToken,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.verifyToken(token);
    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    const passwordHash = this.simpleHash(newPassword);
    
    const user = await databaseService.updateUser(userId, {
      passwordHash,
    });

    if (!user) {
      throw new Error('User not found');
    }
  }

  private generateToken(userId: string): string {
    // Simple token generation (use JWT in production)
    return `${userId}.${Date.now()}`;
  }

  private simpleHash(password: string): string {
    // Simple hash function for demo (use bcrypt in production)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const authService = new AuthService();
