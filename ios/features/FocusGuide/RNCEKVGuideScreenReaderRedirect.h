//
//  RNCEKVGuideScreenReaderRedirect.h
//  react-native-external-keyboard
//
//  Moves VoiceOver focus from the guide to the target.
//

#ifndef RNCEKVGuideScreenReaderRedirect_h
#define RNCEKVGuideScreenReaderRedirect_h

#import <UIKit/UIKit.h>
#import "RNCEKVGuideHost.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVGuideScreenReaderRedirect : NSObject

- (instancetype)initWithHost:(UIView<RNCEKVGuideHost> *)host;

/// VoiceOver landed on the guide: move on to the target, unless it came from the target itself
/// (otherwise swiping past the target would bounce straight back to it).
- (void)redirectIfNeeded;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVGuideScreenReaderRedirect_h */
