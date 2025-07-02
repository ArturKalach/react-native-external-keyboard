//
//  RNCEKVFocusLinkObserverManager.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 26/06/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusLinkObserverManager.h"

@implementation RNCEKVFocusLinkObserverManager

+ (instancetype)sharedManager {
  static RNCEKVFocusLinkObserverManager *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _focusLinkObserver = [[RNCEKVFocusLinkObserver alloc] init];
  }
  return self;
}

@end
