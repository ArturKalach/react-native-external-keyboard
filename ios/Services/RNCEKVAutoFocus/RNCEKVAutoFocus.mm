//
//  RNCEKVAutoFocus.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 17/08/2024.
//

#import <Foundation/Foundation.h>
#import "RCTModalViewController+Focus.h"

#import "RNCEKVAutoFocus.h"

@implementation RNCEKVAutoFocus

+ (instancetype)sharedInstance {
    static RNCEKVAutoFocus *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

@end
