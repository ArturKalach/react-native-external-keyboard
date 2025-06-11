//
//  RNCEKVKeyboardFocusGroup.h
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#ifndef RNCEKVKeyboardFocusGroup_h
#define RNCEKVKeyboardFocusGroup_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVKeyboardFocusGroup : RCTViewComponentView
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property (nonatomic, strong, nullable) NSString *orderGroup;
@property BOOL isGroupFocused;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RNCEKVKeyboardFocusGroup : RCTView
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property (nonatomic, strong, nullable) NSString *orderGroup;
@property BOOL isGroupFocused;
@property (nonatomic, copy) RCTDirectEventBlock onGroupFocusChange;
@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RNCEKVKeyboardFocusGroup_h */
