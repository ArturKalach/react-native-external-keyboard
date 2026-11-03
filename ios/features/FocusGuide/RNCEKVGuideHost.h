//
//  RNCEKVGuideHost.h
//  react-native-external-keyboard
//
//  What the focus guide delegates read from the view.
//

#ifndef RNCEKVGuideHost_h
#define RNCEKVGuideHost_h

#import <UIKit/UIKit.h>
#import "RNCEKVGuideMask.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNCEKVGuideHost <NSObject>
@property (nonatomic, readonly) RNCEKVGuideMaskPolicy *maskPolicy;
@property (nonatomic, readonly) BOOL guideEnabled;
/// The view registered under `preferredFocusOrderId`, or nil.
@property (nonatomic, readonly, nullable) UIView *linkTarget;
@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVGuideHost_h */
