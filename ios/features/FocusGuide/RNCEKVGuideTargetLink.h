//
//  RNCEKVGuideTargetLink.h
//  react-native-external-keyboard
//
//  Follows the view registered under the guide's `preferredFocusOrderId`.
//

#ifndef RNCEKVGuideTargetLink_h
#define RNCEKVGuideTargetLink_h

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVGuideTargetLink : NSObject

@property (nonatomic, copy, nullable) NSString *preferredId;
@property (nonatomic, weak, readonly, nullable) UIView *target;

/// `onChange` runs whenever `target` changes.
- (instancetype)initWithOnChange:(void (^)(void))onChange;

/// Drops the subscription and the target.
- (void)unsubscribe;
/// Only drops the subscription, so it is safe from `dealloc`.
- (void)teardown;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVGuideTargetLink_h */
