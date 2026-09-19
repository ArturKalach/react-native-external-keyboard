//
//  RNCEKVExternalKeyboardLockView.h
//  Pods
//
//  Created by Artur Kalach on 27/01/2026.
//

#ifndef RNCEKVExternalKeyboardLockView_h
#define RNCEKVExternalKeyboardLockView_h


#import <UIKit/UIKit.h>
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVExternalKeyboardLockView : RCTViewComponentView

@property (nonatomic, assign) BOOL forceLock;
@property (nonatomic, assign) BOOL lockDisabled;

@end

NS_ASSUME_NONNULL_END


#endif /* RNCEKVExternalKeyboardLockView_h */
