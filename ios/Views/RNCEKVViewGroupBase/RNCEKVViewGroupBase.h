//
//  RNCEKVViewGroupBase.h
//  Pods
//
//  Created by Artur Kalach on 07/04/2026.
//

#ifndef RNCEKVViewGroupBase_h
#define RNCEKVViewGroupBase_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTViewComponentView.h>
  #define RNCEKVBaseViewClass RCTViewComponentView
#else
  #import <React/RCTView.h>
  #define RNCEKVBaseViewClass RCTView
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVViewGroupBase : RNCEKVBaseViewClass

- (UIView*)getStoredView;
- (void)onSubviewAdded:(UIView *)subview;
- (void)onSubviewRemoved:(UIView *)subview;
- (void)onSubviewsLayoutUpdated;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVViewGroupBase_h */
