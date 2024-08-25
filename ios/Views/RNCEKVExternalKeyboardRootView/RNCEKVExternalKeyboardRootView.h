//
//  RNCEKVExternalKeyboardRootView.h
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 13/08/2024.
//

#ifndef RNCEKVExternalKeyboardRootView_h
#define RNCEKVExternalKeyboardRootView_h


#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardRootView : RCTViewComponentView

@property NSString* viewId;
@property (nullable) UIView* customFocusedView;

- (void)focusView:(UIView*) view;
- (void)setAutoFocus:(UIView*) view;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVExternalKeyboardRootView : RCTView

@property NSString* viewId;
@property (nullable) UIView* customFocusedView;

- (void)focusView:(UIView*) view;
- (void)setAutoFocus:(UIView*) view;

@end


#endif /* RCT_NEW_ARCH_ENABLED */


#endif /* RNCEKVExternalKeyboardRootView_h */
