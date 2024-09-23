//
//  RNCEKVUtils.m
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 05/09/2024.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNCEKVUtils.h"

UIColor *colorFromHexString(NSString *hexString) {
    // Remove '#' if it appears
    NSString *cleanHexString = [hexString stringByReplacingOccurrencesOfString:@"#" withString:@""];
    
    // Handle 3-character hex strings by duplicating characters (e.g. #abc -> #aabbcc)
    if ([cleanHexString length] == 3) {
        unichar chars[6];
        for (int i = 0; i < 3; i++) {
            chars[2 * i] = [cleanHexString characterAtIndex:i];
            chars[2 * i + 1] = [cleanHexString characterAtIndex:i];
        }
        cleanHexString = [NSString stringWithCharacters:chars length:6];
    }
    
    // Ensure that we now have a valid 6 or 8 character hex string
    if ([cleanHexString length] != 6 && [cleanHexString length] != 8) {
        return nil;
    }
    
    unsigned int r, g, b, a = 255; // Default alpha value is 255 (fully opaque)
    
    // Extract RGB(A) components
    NSScanner *scanner = [NSScanner scannerWithString:cleanHexString];
    unsigned hexValue = 0;
    [scanner scanHexInt:&hexValue];
    
    if ([cleanHexString length] == 6) {
        r = (hexValue >> 16) & 0xFF;
        g = (hexValue >> 8) & 0xFF;
        b = hexValue & 0xFF;
    } else if ([cleanHexString length] == 8) {
        a = (hexValue >> 24) & 0xFF;
        r = (hexValue >> 16) & 0xFF;
        g = (hexValue >> 8) & 0xFF;
        b = hexValue & 0xFF;
    }
    
    return [UIColor colorWithRed:((CGFloat)r / 255.0)
                           green:((CGFloat)g / 255.0)
                            blue:((CGFloat)b / 255.0)
                           alpha: 0.8];
}

