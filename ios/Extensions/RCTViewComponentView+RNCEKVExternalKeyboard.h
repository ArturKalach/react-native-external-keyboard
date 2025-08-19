//
//  UIView+RNCEKVExternalKeyboard.h
//  Pods
//
//  Created by Artur Kalach on 12/08/2025.
//

#ifndef UIView_RNCEKVExternalKeyboard_h
#define UIView_RNCEKVExternalKeyboard_h

#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>

@interface RCTViewComponentView (RNCEKVExternalKeyboard)

@property (nonatomic, copy, nullable) NSString *rncekvCustomGroup;
@property (nonatomic, copy, nullable) UIFocusEffect *rncekvCustomFocusEffect;

@end

#endif

#endif /* UIView_RNCEKVExternalKeyboard_h */
