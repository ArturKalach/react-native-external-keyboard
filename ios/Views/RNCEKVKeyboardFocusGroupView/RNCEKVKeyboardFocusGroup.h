//
//  RNCEKVKeyboardFocusGroup.h
//  Pods
//
//  Created by Artur Kalach on 24/12/2024.
//

#ifndef RNCEKVKeyboardFocusGroup_h
#define RNCEKVKeyboardFocusGroup_h

#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVKeyboardFocusGroup : RCTViewComponentView
@property (nonatomic, strong, nullable) NSString *customGroupId;
@property (nonatomic, strong, nullable) NSString *orderGroup;
@property BOOL isGroupFocused;
@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVKeyboardFocusGroup_h */
