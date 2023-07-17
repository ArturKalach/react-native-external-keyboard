//
//  KeyboardKeyPressHandler.m
//  ExternalKeyboard
//
//  Created by Artur Kalach on 21.06.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UIKit/UIResponder.h"
#import "KeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>

@implementation KeyboardKeyPressHandler

static const float LONG_PRESS_DURATION = 0.5;

- (instancetype)init {
    self = [super init];
    if (self) {
        _keyPressedTimestamps = [[NSMutableDictionary alloc] init];
    }
    return self;
}

-(NSDictionary*) getKeyPressEventInfo:(NSSet<UIPress *> *)presses
               withEvent:(UIPressesEvent *)event {
    UIKey *key = presses.allObjects[0].key;
    NSNumber *keyCode = @(key.keyCode);
    NSNumber *isAltPressed = @((key.modifierFlags & UIKeyModifierAlternate) > 0);
    NSNumber *isShiftPressed = @((key.modifierFlags & UIKeyModifierShift) > 0);
    NSNumber *isCtrlPressed = @((key.modifierFlags & UIKeyModifierControl) > 0);
    NSNumber *isCapsLockOn = @((key.modifierFlags & UIKeyModifierAlphaShift) > 0);
    NSNumber *hasNoModifiers = @(key.modifierFlags == 0);
    
    return @{
        @"keyCode": keyCode,
        @"isLongPress": @NO,
        @"isAltPressed": isAltPressed,
        @"isShiftPressed": isShiftPressed,
        @"isCtrlPressed": isCtrlPressed,
        @"isCapsLockOn": isCapsLockOn,
        @"hasNoModifiers": hasNoModifiers,
    };
}

-(NSDictionary*) actionDownHandler:(NSSet<UIPress *> *)presses
                         withEvent:(UIPressesEvent *)event{
    UIKey *key = presses.allObjects[0].key;
    NSNumber *keyCode = @(key.keyCode);
    [_keyPressedTimestamps setObject: @(event.timestamp) forKey: keyCode];
    NSDictionary *info = [self getKeyPressEventInfo:presses withEvent:event];
    return info;
}

-(NSDictionary*) actionUpHandler:(NSSet<UIPress *> *)presses
                       withEvent:(UIPressesEvent *)event {
    UIKey *key = presses.allObjects[0].key;
    NSNumber *keyCode = @(key.keyCode);
    NSNumber *begunPressTimestamp = [_keyPressedTimestamps objectForKey:keyCode];
    NSNumber *pressDuration = @([@(event.timestamp) doubleValue] - [begunPressTimestamp doubleValue]);
    NSNumber *isLognPress = @([pressDuration doubleValue] >= LONG_PRESS_DURATION);
    
    NSDictionary *info = [self getKeyPressEventInfo:presses withEvent:event];
    NSMutableDictionary *result = [NSMutableDictionary dictionaryWithDictionary:info];
    [result addEntriesFromDictionary: @{
        @"isLongPress": isLognPress,
    }];
    
    return result;
}

@end
