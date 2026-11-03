//
//  RNCEKVKeyboardFocusGuide.h
//  react-native-external-keyboard
//
//  iOS host backing `KeyboardFocusGuide` (`Focus.Guide`): redirects hardware-keyboard focus to the view
//  registered under `preferredFocusOrderId`.
//

#ifndef RNCEKVKeyboardFocusGuide_h
#define RNCEKVKeyboardFocusGuide_h

#import <UIKit/UIKit.h>
#import "RNCEKVGuideMask.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVKeyboardFocusGuide : RCTViewComponentView
@property (nonatomic, copy, nullable) NSString *preferredFocusOrderId;
@property (nonatomic, assign) BOOL guideEnabled;
/// Bit flags of the redirected inputs (`RNCEKVGuideMask`), sent from JS as one integer.
@property (nonatomic, assign) NSInteger guideMask;
/// The `groupIdentifier` resolved in JS; the guide is a Tab stop, so it groups like `KeyboardExtendedView`.
@property (nonatomic, copy, nullable) NSString *customGroupId;
/// Without a `customGroupId`, YES gives the guide a generated unique focus group id.
@property (nonatomic, assign) BOOL uniqueGroupIdentifierEnabled;
@end

NS_ASSUME_NONNULL_END

#else /* RCT_NEW_ARCH_ENABLED */

#import <React/RCTView.h>
@interface RNCEKVKeyboardFocusGuide : RCTView
@property (nonatomic, copy, nullable) NSString *preferredFocusOrderId;
@property (nonatomic, assign) BOOL guideEnabled;
/// Bit flags of the redirected inputs (`RNCEKVGuideMask`), sent from JS as one integer.
@property (nonatomic, assign) NSInteger guideMask;
/// The `groupIdentifier` resolved in JS; the guide is a Tab stop, so it groups like `KeyboardExtendedView`.
@property (nonatomic, copy, nullable) NSString *customGroupId;
/// Without a `customGroupId`, YES gives the guide a generated unique focus group id.
@property (nonatomic, assign) BOOL uniqueGroupIdentifierEnabled;
@end

#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVKeyboardFocusGuide_h */
