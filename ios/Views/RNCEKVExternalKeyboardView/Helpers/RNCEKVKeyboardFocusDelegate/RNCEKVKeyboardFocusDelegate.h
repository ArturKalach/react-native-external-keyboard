//
//  RNCEKVKeyboardFocusDelegate.h
//  Pods
//
//  Created by Artur Kalach on 26/08/2024.
//

#ifndef RNCEKVKeyboardFocusDelegate_h
#define RNCEKVKeyboardFocusDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVKeyboardFocusProtocol.h"

@interface RNCEKVKeyboardFocusDelegate : NSObject

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVKeyboardFocusProtocol> *_Nonnull)view;

- (UIView*_Nonnull)getFocusingView;
- (BOOL)canBecomeFocused;
- (void)displayHalo;
- (void)updateHalo;
- (nullable NSNumber*)isFocusChanged:(UIFocusUpdateContext *)context;
- (void)addSubview:(UIView *)view;
@end


#endif /* RNCEKVKeyboardFocusDelegate_h */
