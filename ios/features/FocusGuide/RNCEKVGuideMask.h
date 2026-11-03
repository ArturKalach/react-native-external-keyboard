//
//  RNCEKVGuideMask.h
//  react-native-external-keyboard
//
//  Which inputs a focus guide redirects, and the one place that decides which input wins.
//

#ifndef RNCEKVGuideMask_h
#define RNCEKVGuideMask_h

#import <Foundation/Foundation.h>

/// Keep in sync with guideMask.ts (JS) and GuideMask.java (Android).
typedef NS_OPTIONS(NSInteger, RNCEKVGuideMask) {
  RNCEKVGuideMaskArrows = 1 << 0,
  RNCEKVGuideMaskTab = 1 << 1,
  RNCEKVGuideMaskScreenReader = 1 << 2,
};
/// Arrow keys + Tab.
static const NSInteger RNCEKVGuideMaskDefault = RNCEKVGuideMaskArrows | RNCEKVGuideMaskTab;

NS_ASSUME_NONNULL_BEGIN

@interface RNCEKVGuideMaskPolicy : NSObject

@property (nonatomic, readonly) NSInteger value;
@property (nonatomic, readonly) BOOL hasKeyboard;
@property (nonatomic, readonly) BOOL hasScreenReader;

- (instancetype)initWithValue:(NSInteger)value;
- (BOOL)hasFlag:(RNCEKVGuideMask)flag;

/// A guide for keyboard and screen reader uses the screen reader while VoiceOver runs, the keyboard otherwise.
- (BOOL)redirectsScreenReader:(BOOL)voiceOverRunning;
- (BOOL)redirectsTab:(BOOL)voiceOverRunning;

@end

NS_ASSUME_NONNULL_END

#endif /* RNCEKVGuideMask_h */
