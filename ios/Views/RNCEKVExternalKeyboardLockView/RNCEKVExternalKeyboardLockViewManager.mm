//
//  RNCEKVExternalKeyboardLockViewManager.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 27/01/2026.
//

#import <Foundation/Foundation.h>


#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>
#import "RNCEKVExternalKeyboardLockView.h"
#import "RNCEKVExternalKeyboardLockViewManager.h"

@implementation RNCEKVExternalKeyboardLockViewManager

RCT_EXPORT_MODULE(ExternalKeyboardLockView)

- (UIView *)view
{
  return [[RNCEKVExternalKeyboardLockView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(forceLock, BOOL, RNCEKVExternalKeyboardLockView)
{
  view.forceLock = json ? [RCTConvert BOOL:json] : NO;
}

RCT_CUSTOM_VIEW_PROPERTY(lockDisabled, BOOL, RNCEKVExternalKeyboardLockView)
{
  view.lockDisabled = json ? [RCTConvert BOOL:json] : NO;
}

@end
