//
//  RNCEKVFabricEventHelper.m
//  Pods
//
//  Created by Artur Kalach on 22/08/2024.
//
#ifdef RCT_NEW_ARCH_ENABLED
#import <Foundation/Foundation.h>

#import "RNCEKVFabricEventHelper.h"

#import "RNCEKVHeaders.h"

using namespace facebook::react;

@implementation RNCEKVFabricEventHelper

+ (void)onKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        
        facebook::react::ExternalKeyboardViewEventEmitter::OnKeyDownPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [[[dictionary valueForKey:@"unicodeChar"] stringValue] UTF8String],
        };
        viewEventEmitter->onKeyDownPress(data);
    };
}

+ (void)onKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        
        facebook::react::ExternalKeyboardViewEventEmitter::OnKeyUpPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [[[dictionary valueForKey:@"unicodeChar"] stringValue] UTF8String],
        };
        viewEventEmitter->onKeyUpPress(data);
    };
}

+ (void)onBubbledKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        
        facebook::react::ExternalKeyboardViewEventEmitter::OnBubbledKeyDownPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [[[dictionary valueForKey:@"unicodeChar"] stringValue] UTF8String],
        };
        viewEventEmitter->onBubbledKeyDownPress(data);
    };
}

+ (void)onBubbledKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        
        facebook::react::ExternalKeyboardViewEventEmitter::OnBubbledKeyUpPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [[[dictionary valueForKey:@"unicodeChar"] stringValue] UTF8String],
        };
        viewEventEmitter->onBubbledKeyUpPress(data);
    };
}

+ (void)onFocusChangeEventEmmiter:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        facebook::react::ExternalKeyboardViewEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

+ (void)onContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        facebook::react::ExternalKeyboardViewEventEmitter::OnContextMenuPress data = {};
        viewEventEmitter->onContextMenuPress(data);
    };
}

+ (void)onBubbledContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<ExternalKeyboardViewEventEmitter const>(_eventEmitter);
        facebook::react::ExternalKeyboardViewEventEmitter::OnBubbledContextMenuPress data = {};
        viewEventEmitter->onBubbledContextMenuPress(data);
    };
}


@end
#endif
