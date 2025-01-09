//
//  RNCEKVFabricEventHelper.h
//  Pods
//
//  Created by Artur Kalach on 22/08/2024.
//

#ifdef RCT_NEW_ARCH_ENABLED
#ifndef RNCEKVFabricEventHelper_h
#define RNCEKVFabricEventHelper_h
#import "RNCEKVHeaders.h"

using namespace facebook::react;

@interface RNCEKVFabricEventHelper: NSObject

+ (void)onKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onBubbledKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onBubbledKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onFocusChangeEventEmmiter:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) emitter;

+ (void)onBubbledContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) emitter;

@end


#endif /* RNCEKVFabricEventHelper_h */
#endif
