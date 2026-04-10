//
//  RNCEKVFocusSequenceDelegate.h
//  react-native-external-keyboard
//

#ifndef RNCEKVFocusSequenceDelegate_h
#define RNCEKVFocusSequenceDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusOrderProtocol.h"

@interface RNCEKVFocusSequenceDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)view;

- (NSNumber *_Nullable)shouldUpdateFocusInContext:(UIFocusUpdateContext *_Nonnull)context;

- (void)link;
- (void)unlink;
- (void)updatePosition:(NSNumber *_Nullable)position;
- (void)updateOrderGroup:(NSString *_Nullable)orderGroup;

@end

#endif /* RNCEKVFocusSequenceDelegate_h */
