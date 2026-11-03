//
//  RNCEKVGuideTargetLink.mm
//  react-native-external-keyboard
//

#import "RNCEKVGuideTargetLink.h"
#import "RNCEKVFocusLinkObserver.h"
#import "RNCEKVOrderSubscriber.h"

@interface RNCEKVGuideTargetLink ()
@property (nonatomic, weak, nullable) UIView *target;
@end

@implementation RNCEKVGuideTargetLink {
  RNCEKVOrderSubscriber *_subscriber;
  void (^_onChange)(void);
}

- (instancetype)initWithOnChange:(void (^)(void))onChange
{
  if (self = [super init]) {
    _onChange = [onChange copy];
  }
  return self;
}

- (void)setPreferredId:(NSString *)preferredId
{
  if ((_preferredId == preferredId) || [_preferredId isEqualToString:preferredId]) {
    return;
  }
  [self unsubscribe];
  _preferredId = [preferredId copy];
  [self subscribe];
}

- (void)subscribe
{
  NSString *linkId = _preferredId;
  if (linkId.length == 0) return;

  __weak RNCEKVGuideTargetLink *weakSelf = self;
  _subscriber = [[RNCEKVFocusLinkObserver sharedManager]
      subscribe:linkId
      onLinkUpdated:^(UIView *link) {
        [weakSelf updateTarget:link];
      }
      onLinkRemoved:^{
        [weakSelf updateTarget:nil];
      }];
}

- (void)teardown
{
  if (_subscriber) {
    [[RNCEKVFocusLinkObserver sharedManager] unsubscribe:_subscriber];
    _subscriber = nil;
  }
}

- (void)unsubscribe
{
  [self teardown];
  [self updateTarget:nil];
}

- (void)updateTarget:(UIView *)target
{
  self.target = target;
  if (_onChange) _onChange();
}

@end
