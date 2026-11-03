//
//  RNCEKVGroupIdentifierProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVGroupIdentifierProtocol_h
#define RNCEKVGroupIdentifierProtocol_h

#import <Foundation/Foundation.h>

@protocol RNCEKVGroupIdentifierProtocol <NSObject>

- (NSString*) customGroupId;
/// YES: a view without a `customGroupId` gets a generated unique group id. Default NO.
- (BOOL) uniqueGroupIdentifierEnabled;
- (UIView*) getFocusTargetView;

@end

#endif /* RNCEKVGroupIdentifierProtocol_h */
