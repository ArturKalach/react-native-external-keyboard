//
//  RNCEKVFocusLinkDelegate.h
//  react-native-external-keyboard
//

#ifndef RNCEKVFocusLinkDelegate_h
#define RNCEKVFocusLinkDelegate_h

#import <Foundation/Foundation.h>
#import "RNCEKVFocusOrderProtocol.h"
#import "RNCEKVFocusGuideHelper.h"

@interface RNCEKVFocusLinkDelegate : NSObject

- (instancetype _Nonnull)initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)view;

- (NSNumber *_Nullable)shouldUpdateFocusInContext:(UIFocusUpdateContext *_Nonnull)context;

- (void)link;
- (void)unlink;

- (void)linkId;
- (void)refreshId:(NSString *_Nullable)prev next:(NSString *_Nullable)next;
- (void)setIsFocused:(BOOL)value;

- (void)refreshLeft:(NSString *_Nullable)next;
- (void)refreshRight:(NSString *_Nullable)next;
- (void)refreshUp:(NSString *_Nullable)next;
- (void)refreshDown:(NSString *_Nullable)next;

- (void)clear;

@end

#endif /* RNCEKVFocusLinkDelegate_h */
