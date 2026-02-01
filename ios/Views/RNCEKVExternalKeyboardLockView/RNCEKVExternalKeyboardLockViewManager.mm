//
//  RNCEKVExternalKeyboardLockViewManager.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 27/01/2026.
//

#import <Foundation/Foundation.h>


#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RNCEKVExternalKeyboardLockView.h"
#import "RNCEKVExternalKeyboardLockViewManager.h"

@implementation RNCEKVExternalKeyboardLockViewManager

RCT_EXPORT_MODULE(ExternalKeyboardLockView)

- (UIView *)view
{
  return [[RNCEKVExternalKeyboardLockView alloc] init];
}

@end
